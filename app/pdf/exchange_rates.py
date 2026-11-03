import json
import logging
import urllib.error
import urllib.request
from decimal import Decimal
from typing import Dict

from django.core.cache import cache

logger = logging.getLogger(__name__)

PRIVATBANK_URL = "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
CACHE_KEY = "pdf:exchange_rates"
CACHE_TTL_SECONDS = 60 * 60
REQUEST_TIMEOUT_SECONDS = 5
FALLBACK_RATES = {"USD": Decimal("42.3"), "EUR": Decimal("44.25")}


class ExchangeRateError(Exception):
    """The exchange rate service returned an unusable response."""


class ExchangeRateProvider:
    """Returns UAH sale rates by currency code, cached for an hour; falls back to static rates on failure."""

    def __init__(self, url: str = PRIVATBANK_URL, timeout: int = REQUEST_TIMEOUT_SECONDS) -> None:
        self.url = url
        self.timeout = timeout

    def get_rates(self) -> Dict[str, Decimal]:
        rates = cache.get(CACHE_KEY)
        if rates is not None:
            return rates
        try:
            rates = self._fetch()
        except (ExchangeRateError, urllib.error.URLError, TimeoutError, ValueError) as e:
            logger.warning("Exchange rates unavailable, using fallback: %s", e)
            return dict(FALLBACK_RATES)
        cache.set(CACHE_KEY, rates, CACHE_TTL_SECONDS)
        return rates

    def _fetch(self) -> Dict[str, Decimal]:
        with urllib.request.urlopen(self.url, timeout=self.timeout) as response:
            if response.status != 200:
                raise ExchangeRateError(f"unexpected HTTP status {response.status}")
            data = json.loads(response.read().decode("utf-8"))
        try:
            return {item["ccy"]: Decimal(item["sale"]) for item in data}
        except (KeyError, TypeError, ArithmeticError) as e:
            raise ExchangeRateError(f"malformed response: {e}") from e
