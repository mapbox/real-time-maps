require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { TilesetsAPI } = require("@sansumbrella/mapbox-tilesets");

/**
 * Script for creating a tileset using the Mapbox Tilesets API.
 * Uploads sample data, a recipe, and publishes a tileset to your account
 * as configured in your shell environment.
 */
async function main() {
    const user = process.env.MAPBOX_USERNAME;
    const token = process.env.MAPBOX_ACCESS_TOKEN;
    const sourceName = "us-counties";
    const tilesetName = "conus-counties";
    const dataFile = "./counties.ndjson";
    const recipeFile = "./recipe.json";

    if (!user || !token) {
        console.error(`A username and access token are required. Set them in your environment or in an .env file. You provided username: ${user}, access token: ${token}`);
        return 1;
    }

    try {
        const tilesets = new TilesetsAPI(user, token);
        const sources = await tilesets.listSources();
        if (sources.some(sourceID => sourceID.indexOf(sourceName) !== -1)) {
            console.log(`you (${user}) already have a source by this name (${sourceName}); skipping upload. Delete the source first if you wish to update the data.`);
        } else {
            console.log("uploading source file");
            const sourceData = fs.createReadStream(path.resolve(dataFile));
            const sourceUploadJob = await tilesets.uploadSource(sourceData, sourceName);
            console.log(sourceUploadJob);
            if (!sourceUploadJob.success) {
                return 1;
            }
        }

        console.log(`uploading or updating recipe for ${tilesetName}`);
        const recipeData = JSON.parse(fs.readFileSync(recipeFile).toString().replace(/USER_NAME/g, user));
        const validationJob = await tilesets.validateRecipe(JSON.stringify(recipeData));
        console.log(validationJob);
        const recipeUploadJob = await tilesets.uploadRecipe(recipeData, tilesetName);
        console.log(recipeUploadJob);

        console.log(`publishing tileset ${user}.${tilesetName}`);
        const publishJob = await tilesets.publishTileset(tilesetName);
        console.log(publishJob);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
