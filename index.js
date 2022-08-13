import { getAllInfoByISO } from "iso-country-currency";
import clm from 'country-locale-map';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const response = await fetch(request);
    const contentType = response.headers.get('Content-Type');

    if (!contentType.startsWith('text/html')) return response;

    const cf = request.cf;
    const dateToday = new Date();
    const dateTomorrow = new Date(dateToday + (3600 * 1000 * 24))

    const countryLocale = { ...clm.getCountryByAlpha2(cf.country), ...getAllInfoByISO(cf.country)};
    const locale = countryLocale.default_locale.replace('_','-');

    const replace = {
        siteCurrent: null,
        timezone: cf.timezone,
        dateToday: dateToday.toLocaleDateString('en-US'),
        dateTodayLocal: dateToday.toLocaleDateString(locale), // countryLocal.dateFormat
        dateTomorrow: dateTomorrow.toLocaleDateString('en-US'),
        dateTomorrowLocal: dateTomorrow.toLocaleDateString(locale),
        dateYear: dateToday.getFullYear(),
        geoCountry: new Intl.DisplayNames(['en-US'], { type: 'region' }).of(cf.country),
        geoCountryLocal:  new Intl.DisplayNames([locale], { type: 'region' }).of(cf.country), // TODO: LANG
        geoCountryCode: cf.country,
        geoRegion: cf.region,
        geoRegionCode: cf.regionCode,
        geoCity: cf.city,
        geoPostalCode: cf.postalCode,
        geoLon: cf.longitude,
        geoLat: cf.latitude,
        currency: countryLocale.currency_name,
        currencySymbol: countryLocale.symbol,
        currencyName: countryLocale.currency,
        lang: countryLocale.default_locale,
        langBrowser: response.headers.get('Accepted-Language'),
    };

    return new HTMLRewriter().on('[data-replace]', new ReplaceData(replace)).transform(response);
}

class ReplaceData {
    constructor(replace) {
        this.replace = replace;
    }
    element(element) {
        if (element.hasAttribute('data-replace')) {
            element.setInnerContent(this.replace[element.getAttribute('data-replace')] ?? null);
        }
    }
}
