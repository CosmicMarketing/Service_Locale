import { getAllInfoByISO } from "iso-country-currency";
import clm from 'country-locale-map';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

const replaceAttribute = 'data-replace';

async function handleRequest(request) {
    const response = await fetch(request);
    const contentType = response.headers.get('Content-Type');

    if (!contentType.startsWith('text/html')) return response;

    const cf = request.cf;
    const dateToday = new Date();
    const dateTomorrow = new Date(dateToday + (3600 * 1000 * 24))

    const countryLocale = { ...clm.getCountryByAlpha2(cf.country), ...getAllInfoByISO(cf.country)};
    const locale = countryLocale.default_locale.replace('_','-');

    const replaceFields = {
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

    return new HTMLRewriter().on(`[${replaceAttribute}]`, new ReplaceData(replaceFields, replaceAttribute)).transform(response);
}

class ReplaceData {
    constructor(fields, attribute) {
        this.fields = fields;
        this.attribute = attribute;
    }
    element(element) {
        if (
            element.hasAttribute(this.attribute)
            && this.fields.hasOwnProperty(element.getAttribute(this.attribute))
        ) {
            element.setInnerContent(this.fields[element.getAttribute(this.attribute)]);
        }
    }
}
