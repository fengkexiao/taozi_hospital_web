const getters = {
  userInfo: state => state.user.userInfo,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  routes: state => state.user.menus,
  tmc: state => state.tmc,
  tim: state => state.tim
};
export default getters;
