/**
 *    Store: SAuth
 *    Description: Manages user auth and logged in state.
 *
 *
 *  **THIS CODE WAS GENERATED BY A TOOL**
 * **eOcean vue nuxt generator
 *
 * This is an implementation of a store to implement login
 * functionality
 * -auth management
 * -login state management
 * -etc.
 */
import axios from "axios";
import btoa from "btoa";

export const state = () => ({
  loading: false, //True if app is in a loading state.  Bind your progress indicators here.
isLoggedIn: false, //True iff user is logged in
loginErrMessage: null, //Any error messages from loggin in should be emitted here.
loginAPIEndpoint: "http://localhost:9001/auth", //The endpoint for the login api (i.e. /api/login)
me: null, //User data from auth service
token: null, //Primary auth token


  allRoutes: [],
});

export const getters = {
  loading: (state) => state.loading, //True if app is in a loading state.  Bind your progress indicators here.
isLoggedIn: (state) => state.isLoggedIn, //True iff user is logged in
loginErrMessage: (state) => state.loginErrMessage, //Any error messages from loggin in should be emitted here.
loginAPIEndpoint: (state) => state.loginAPIEndpoint, //The endpoint for the login api (i.e. /api/login)
me: (state) => state.me, //User data from auth service
token: (state) => state.token, //Primary auth token


  allRoutes: (state) => state.allRoutes,
};

export const actions = {
  allRoutes: (ctx, router) => {
    const routes = [];
    if (!router) return;
    router.options.routes.forEach((route) => {
      routes.push({
        name: route.name,
        path: route.path,
        icon: "mdi-link",
      });
    });
    ctx.commit("allRoutes", routes);
    return routes;
  },
  /*logs the user in to db*/
  doLogin: (ctx, value) => {
    const { userName, password } = value;

    ctx.commit("loading", false);

    axios
      .post(
        ctx.state.loginAPIEndpoint,
        {
          access_token: "sKOnMMiaL1CTKmrFKuLJsqths9MYLfZQ",
        },
        {
          headers: {
            Authorization:
              //"Basic " + btoa("richard@eoceandata.com" + ":" + "123456"),
              "Basic " + btoa(userName + ":" + password),
          },
        }
      )
      .then(function (response) {
        //Store token
        localStorage.setItem("h167", response.data.token);
        ctx.commit("token", response.data.token);

        //Store user.
        const updateStoreWithUser = (userData) => {
          ctx.commit("me", userData);
        };
        updateStoreWithUser(response.data.user);
        ctx.commit("isLoggedIn", true);
      })
      .catch((err) => {
        ctx.commit("isLoggedIn", false);
        console.log(err);
      })
      .finally(() => {
        ctx.commit("loading", false);
      });
  },
  doLogout: (ctx, value) => {
    ctx.commit("isLoggedIn", false);
  },
  
};

export const mutations = {
  loading: (state, value) => state.loading=value, //True if app is in a loading state.  Bind your progress indicators here.
isLoggedIn: (state, value) => state.isLoggedIn=value, //True iff user is logged in
loginErrMessage: (state, value) => state.loginErrMessage=value, //Any error messages from loggin in should be emitted here.
loginAPIEndpoint: (state, value) => state.loginAPIEndpoint=value, //The endpoint for the login api (i.e. /api/login)
me: (state, value) => state.me=value, //User data from auth service
token: (state, value) => state.token=value, //Primary auth token


  allRoutes: (state, value) => (state.allRoutes = value),
};
