import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";

import Authentication from '@/views/Authentication.vue';


import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes);

Vue.component('font-awesome-icon', FontAwesomeIcon);

const httpLink = new HttpLink({
  // URL to graphql server
  uri: "http://contentapi.local/graphql"
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.use(VueApollo);

Vue.config.productionTip = false;

Vue.component('test', Authentication);

new Vue({
  router,
  apolloProvider,
  store,
  render: h => h(App)
}).$mount("#app");
