const mix      = require('wp-mix');
const fsExtra  = require("fs-extra");
const path     = require("path");
const cliColor = require("cli-color");
const emojic   = require("emojic");
const min      = Mix.inProduction() ? '.min' : '';

const PackageFile = JSON.parse(File.find(Mix.paths.root('package.json')).read());

if (process.env.NODE_ENV === 'package') {

    mix.then(function () {

        let bundledir = path.basename(path.resolve(__dirname));
        let copyfrom  = path.resolve(__dirname);
        let copyto    = path.resolve(`${bundledir}`);
        // Select All file then paste on list
        let list      = `assets
includes
languages
package.json
webpack.mix.js
woo-variation-gallery-pro.php`;

        let includes = list.split("\n");
        fsExtra.ensureDir(copyto, function (err) {
            if (err) return console.error(err)

            includes.map(include => {

                fsExtra.copy(`${copyfrom}/${include}`, `${copyto}/${include}`, function (err) {
                    if (err) return console.error(err)

                    console.log(cliColor.white(`=> ${emojic.smiley}  ${include} copied...`));

                    /*if (include == 'assets') {
                     // Just Removed SCSS Dir
                     fsExtra.removeSync(`${copyto}/${include}/scss`);
                     }*/
                })
            });

            console.log(cliColor.white(`=> ${emojic.whiteCheckMark}  Build directory created`));
        })
    });

    return;
}

if (Mix.inProduction()) {
    mix.generatePot({
        package   : 'WooCommerce Variation Gallery - Pro',
        bugReport : 'https://github.com/EmranAhmed/woo-variation-gallery-pro/issues',
        src       : '**/*.php',
        domain    : 'woo-variation-gallery-pro',
        destFile  : `languages/woo-variation-gallery-pro.pot`
    });
}

mix.banner({
    banner : "WooCommerce Variation Gallery - Pro v1.1.7 \n\nAuthor: Emran Ahmed ( emran.bd.08@gmail.com ) \nDate: " + new Date().toLocaleString() + "\nReleased under the GPLv3 license."
});

mix.notification({
    title : 'WooCommerce Variation Gallery - Pro',
    // contentImage : Mix.paths.root('images/logo.png')
});

if (!Mix.inProduction()) {
    mix.sourceMaps();
}

//mix.js(`src/js/add-to-cart-variation.js`, `assets/js/add-to-cart-variation${min}.js`);
mix.js(`src/js/frontend.js`, `assets/js/frontend-pro${min}.js`);
mix.sass(`src/scss/frontend.scss`, `assets/css/frontend-pro${min}.css`);
//mix.sass(`src/scss/theme-override.scss`, `assets/css/wvs-pro-theme-override${min}.css`);

mix.js(`src/js/theme-support.js`, `assets/js/theme-support-pro${min}.js`);
mix.js(`src/js/backend.js`, `assets/js/admin-pro${min}.js`);
mix.sass(`src/scss/backend.scss`, `assets/css/admin-pro${min}.css`);