import json
import urllib.error
from decimal import Decimal
from unittest.mock import MagicMock, patch

from django.core.cache import cache
from django.test import SimpleTestCase

from pdf.exchange_rates import FALLBACK_RATES, ExchangeRateProvider


def _response(payload, status=200):
    resp = MagicMock()
    resp.status = status
    resp.read.return_value = json.dumps(payload).encode()
    resp.__enter__.return_value = resp
    return resp


class ExchangeRateProviderTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    @patch('pdf.exchange_rates.urllib.request.urlopen')
    def test_parses_and_caches(self, urlopen):
        urlopen.return_value = _response([{"ccy": "USD", "sale": "41.5"}, {"ccy": "EUR", "sale": "45"}])
        provider = ExchangeRateProvider()
        self.assertEqual(provider.get_rates()["USD"], Decimal("41.5"))
        provider.get_rates()
        self.assertEqual(urlopen.call_count, 1)
        self.assertEqual(urlopen.call_args.kwargs['timeout'], 5)

    @patch('pdf.exchange_rates.urllib.request.urlopen', side_effect=TimeoutError('slow'))
    def test_timeout_falls_back(self, _):
        self.assertEqual(ExchangeRateProvider().get_rates(), FALLBACK_RATES)

    @patch('pdf.exchange_rates.urllib.request.urlopen')
    def test_bad_payload_and_http_error_fall_back(self, urlopen):
        urlopen.return_value = _response([{"nope": 1}])
        self.assertEqual(ExchangeRateProvider().get_rates(), FALLBACK_RATES)
        urlopen.side_effect = urllib.error.URLError('down')
        self.assertEqual(ExchangeRateProvider().get_rates(), FALLBACK_RATES)
