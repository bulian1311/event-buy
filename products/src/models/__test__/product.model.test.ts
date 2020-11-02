import { Product } from "../product.model";

it("Проверка OCC (optimistic concurrency control)", async (done) => {
  const product = Product.build({
    title: "Test product",
    price: 123,
    userId: "123",
  });
  await product.save();

  const instance1 = await Product.findById(product.id);
  const instance2 = await Product.findById(product.id);

  instance1!.set({ price: 111 });
  instance2!.set({ price: 222 });

  await instance1!.save();

  try {
    await instance2!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Ошибка не должна быть брошена.");
});

it("Увеличивает номер версии документа при редактировании.", async () => {
  const product = Product.build({
    title: "Test product",
    price: 123,
    userId: "123",
  });

  await product.save();
  expect(product.version).toEqual(0);

  await product.save();
  expect(product.version).toEqual(1);

  await product.save();
  expect(product.version).toEqual(2);
});
