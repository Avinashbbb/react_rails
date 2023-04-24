export const setData = (name, data, count) => ({
  type: `SET_${name}`,
  data,
  count,
});

export const setLoaded = name => ({
  type: `LOADED_${name}`,
});

export const setLoading = name => ({
  type: `LOADING_${name}`,
});
