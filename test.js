const data = [];

const second = async () => {
  data[0] = 32;
  await first();
  console.log(data);
};

const first = async () => {
  console.log("I should always run first.");
  for (var i = 0; i < 10; i++) data[i] = i;
};

second();
