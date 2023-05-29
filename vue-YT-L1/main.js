Promise.resolve()
  .then(() => console.log(1))
  .then(() => {
    throw new Error();
  })
  .then(() => console.log(2))
  .catch(() => console.log("Some error"))
  .then(() => console.log(3))
  .then(() => new Promise((resolve) => resolve(4)))
  .then((val) => console.log(val));
