export default function setFilters(filters: any) {
  const outFilters: any = {};
  for (const key of Object.keys(filters)) {
    if (typeof filters[key] === 'object' && filters[key].id) {
      outFilters[key + '.id'] = filters[key].id;
    } else if (typeof filters[key] === 'string') {
      outFilters[key] = filters[key];
    }

    return outFilters;
  }
}
