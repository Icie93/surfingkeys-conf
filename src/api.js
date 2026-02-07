// polyfill getBrowserName for pre-1.0
const getBrowserName = () => {
  if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
    return "Chrome"
  }
  if (window.navigator.vendor.indexOf("Apple Computer, Inc.") === 0) {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    return isIOS ? "Safari-iOS" : "Safari"
  }
  if (window.navigator.userAgent.indexOf("Firefox") !== -1) {
    return "Firefox"
  }
  return "Chrome"
}

const getApi = () => {
  if (typeof window === "undefined") {
    return {}
  }

  if (typeof api !== "undefined") {
    // Surfingkeys >= 1.0
    // Normalize the search-alias API: different Surfingkeys versions expose
    // either addSearchAliasX (extended signature) or addSearchAlias.
    const skApi = api
    const addSearchAliasCompat = (
      alias,
      prompt,
      searchUrl,
      leaderKey,
      suggestUrl,
      suggestCb,
      postData,
      options
    ) => {
      if (typeof skApi.addSearchAliasX === "function") {
        return skApi.addSearchAliasX(
          alias,
          prompt,
          searchUrl,
          leaderKey,
          suggestUrl,
          suggestCb,
          postData,
          options
        )
      }

      if (typeof skApi.addSearchAlias !== "function") {
        throw new Error("Surfingkeys API missing addSearchAlias/addSearchAliasX")
      }

      // Try a few known signatures in decreasing specificity.
      try {
        return skApi.addSearchAlias(
          alias,
          prompt,
          searchUrl,
          leaderKey,
          suggestUrl,
          suggestCb,
          postData,
          options
        )
      } catch (e) {
        // ignore and fall through
      }
      try {
        return skApi.addSearchAlias(
          alias,
          prompt,
          searchUrl,
          suggestUrl,
          suggestCb,
          options
        )
      } catch (e) {
        // ignore and fall through
      }
      return skApi.addSearchAlias(alias, prompt, searchUrl, options)
    }

    return {
      v1: true,
      ...skApi,
      addSearchAlias: addSearchAliasCompat,
    }
  }

  // Surfingkeys < 1.0
  return {
    v1: false,
    getBrowserName,

    /* eslint-disable no-undef */
    RUNTIME,
    Clipboard,
    Normal,
    Hints,
    Visual,
    Front,

    insertJS: Normal.insertJS,
    addSearchAlias: addSearchAliasX,

    aceVimMap,
    addVimMapKey,
    cmap,
    imap,
    imapkey,
    getClickableElements,
    getFormData,
    map,
    unmap,
    unmapAllExcept,
    iunmap,
    vunmap,
    mapkey,
    readText,
    removeSearchAlias,
    searchSelectedWith,
    tabOpenLink,
    vmap,
    vmapkey,
    /* eslint-enable no-use-before-define,no-undef */
  }
}

export default getApi()
