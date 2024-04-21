// @ts-check

/**
 * @function
 * @return {string}
 */
export function generateId() {
  const id = `proto-${Math.floor(Math.random() * 999999999999999)}`;

  if (document.getElementById(id) !== null) {
    return this.generateId();
  } else {
    return id;
  }
}
