# Service_Locale
Cloudflare Worker Middleware for Dynamically Replacing Local Information

`<font data-replace="siteDomain"></font>`

```json
{
    siteDomain: "yourwebsite.com",
    timezone: cf.timezone,
    dateToday: "8/16/2022",
    dateTodayLocal: "16/08/2022",
    dateTomorrow: "8/17/2022",
    dateTomorrowLocal: "17/08/2022",
    dateYear: "2022",
    geoCountry: "Germany",
    geoCountryLocal:  "Deutchland",
    geoCountryCode: "DE,
    geoRegion: "Florida",
    geoRegionCode: "FL",
    geoCity: "New York",
    geoPostalCode: "10016",
    geoLon: null,
    geoLat: null,
    currency: "USD",
    currencySymbol: "$",
    currencyName: "US Dollar",
    lang: "en_US",
    langBrowser: null,
}
```
