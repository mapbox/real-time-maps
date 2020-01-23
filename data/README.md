# Data Preparation

A basic script for uploading data to Mapbox. Read more about the [Tilesets API](https://docs.mapbox.com/api/maps/#creating-new-tilesets-with-the-tilesets-api) in the online documentation.

## Usage

The [`uploadData.js`](./uploadData.js) script combines all the steps needed to create a working tileset. To use it, ensure you have configured your environment with a secret token that has tilesets scopes. This can be done by editing the [`sample.env`](../sample.env) file in the top-level project directory and saving it as `.env`. The top-level node scripts will copy the `.env` file into this directory.

```
MAPBOX_USERNAME=your-username
MAPBOX_ACCESS_TOKEN=sk.your-secret-token-hash
```

To make a tileset with that script using default options and sample data, run the following command (it is defined in [package.json](./package.json)).

```
npm run upload-data
```

The upload script performs the following steps:

1) Upload data as a tileset source
2) Upload the recipe to create a tileset
3) Publish the Tileset defined by the recipe

For more comprehensive tileset management, you can use the [Tilesets CLI](https://docs.mapbox.com/api/maps/#the-tilesets-cli).

## Sample Data
 
The sample data in this directory is used by the server and the upload scripts.
 
To create the county data, we correlated [500k cartographic boundary data](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html) with the [2018 state FIPS codes](https://www.census.gov/geographies/reference-files/2018/demo/popest/2018-fips.html). Both data sets are sourced from the US Census website.

The animation sequence data was generated with data from the MIT elections lab, the American Community Survey, and Natural Earth. It combines voter turnout and population data so we can see where participation is high and low across the country.

Source data is available under the licenses described in the following table:

| Data | Source | License |
| --- | --- | --- |
| [500k county boundaries](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html) | US Census Bureau TIGER | Public Domain |
| [County FIPS codes](https://www.census.gov/geographies/reference-files/2018/demo/popest/2018-fips.html) | US Census Bureau | Public Domain |
| [U.S. President 1976–2016](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/42MVDX) | MIT Election Data and Science Lab | [CC0 - "Public Domain Dedication"](https://creativecommons.org/publicdomain/zero/1.0/legalcode) |
| [American Community Survey Population Estimates 2016](https://www.census.gov/data/developers/data-sets/acs-1year.html) | US Census Bureau | Public Domain |
| [Natural Earth time zones](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/timezones/) | Natural Earth | [Public Domain Dedication](https://github.com/nvkelso/natural-earth-vector/blob/master/LICENSE.md) |

The data in this directory is available under the [CC0 - "Public Domain Dedication"](https://creativecommons.org/publicdomain/zero/1.0/legalcode).

![public domain dedication license](https://i.creativecommons.org/p/zero/1.0/88x31.png)

Recommended citation:  
Mapbox Solutions Architecture, 2019, "US counties with state names", https://www.mapbox.com/solutions/real-time-maps

The code in this directory is available under the [BSD-3-Clause license](../LICENSE.md).

