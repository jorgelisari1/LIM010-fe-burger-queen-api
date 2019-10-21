module.exports = (url, page, limit, number) => {
  const next = `limit=${limit}&page=${limit*page < number ? page+1 :Math.ceil(number / limit)}`;
  const last = `limit=${limit}&page=${Math.ceil(number / limit)}`;
  const first = `limit=${limit}&page=${page > 1 ? 1 : page}`;
  const prev = `limit=${limit}&page=${page  > 1 ? page - 1 : 1}`;
  return `<${url}?${first}>; rel="first",<${url}?${prev}>; rel="prev",<${url}?${next}>; rel="next",<${url}?${last}>; rel="last"`;
}