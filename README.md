# Landing Page for MailPace.com

A simple landing page using the CSS framework Tailwind in a proper PostCSS environment.

## Production setup

This is deployed on netlify via the netlify github integration, with settings as follows:

- Published folder set to `/public`
- Build script of `npm run production` to re-build the css on deployment
- DNS cname that points to the netlify domain

[![Netlify Status](https://api.netlify.com/api/v1/badges/1d994b65-d494-4f7b-a48e-8d0e3e14e5a6/deploy-status)](https://app.netlify.com/sites/boring-ardinghelli-0d5d19/deploys)

## Development:

1. Install the dependencies:

    ```bash
    # Using npm
    npm install
    ```
2. Start the development server:

    ```bash
    # Using npm
    npm run serve
    ```

    Now you should be able to see the project running at localhost:8080.

3. Open `public/index.html` in your editor

## Building for production

For production purposes, the PostCSS uses the [Purgecss](https://www.purgecss.com/) and [cssnano](https://cssnano.co/) to optimize your CSS!

To build an optimized version of your CSS, simply run:

```bash
# Using npm
npm run production
```

After that's done, check out `./public/build/tailwind.css` to see the optimized output.
