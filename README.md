# Blockmason Credit Protocol Hackathon Submission

To whom it may concern: This repository branch serves as our submission to the blockmason credit protocol hackathon. This repository as a whole is a in-progress project that the 6Side team is building to facilitate gift card related workflows via the ethereum blockchain and blockmason credit protocol.

This readme will cover technologies used, use case authority functionalities (both developed and future implementations), and installation process of the current build.

# Gifter

The Gifter application is a google chrome extension that will allow users to trade giftcards with their peers, purchase giftcards from certain retailers, redeem gift cards in their inventory, as well as serve many other functionalities. The extension is built using Angular (version 6.0.8) for a front-end tool, and is using the ethereum blockchain as a datastore. To communicate between the ethereum blockchain and angular front end, the web3js (version 1.0.0-beta34) library is being used. Other third party components include the metamask keyring controller which allows users to create a gifter account and automatically vault their private key only within the scope of their local storage allowing secure, ease of access to the gifter application.

# Use Cases

The current use case authority contract only has one enabled function which facilitates the trading of gift cards. This function is well documented in the GifterUCACs.sol file.

Other planned use cases authority functionalities planned for implementation are functions that facilitate redeeming gift cards, purchasing gift cards, and posting marketplace listings for giftcards

# Installation

this should be fairly straightforward as im sure you guys have installed dependencies for an angular application before

1. basically after you pull the repo just run npm install
2. running application -> ng serve or npm start

to test in chrome extension

3. ng build
4. navigate to /dist/gifter
5. copy the v2.png and manifest.json located in the /after_build/ directory to the /dist/gifter/ directory
6. go to google chrome -> settings -> more tools -> extensions
7. click load unpacked
8. choose the /dist/gifter/ directory 
9. if there are any issues im sure you smart people can figure it out

if everything works you should see the 6Side logo in the top right along with your other extensions

please don't hesitate to reach out to hunterls@my.yorku.ca for assistance with installation

# Gifter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
