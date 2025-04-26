#### Tensor的创建

```python
# 基本定义
b = torch.Tensor([[1, 2], [3, 4]])	# 直接赋值
print(a)
print(a.type())

# 全0张量
a = torch.zeros(2, 2)	# 指定shape
print(a)
print(a.type())

a = torch.zeros_like(b)		# 创建和b同shape的全0张量
print(a)
print(a.type())

# 全1张量
a = torch.ones(2, 2)
print(a)
print(a.type())

a = torch.ones_like(b)		# 创建和b同shape的全1张量
print(a)
print(a.type())

# 随机张量
a = torch.rand(2, 2)	# 指定shape
print(a)
print(a.type())

# 标准分布
# "mean"为均值，"std"为标准差
a = torch.normal(mean=torch.rand(5), std=torch.rand(5))
print(a)
print(a.type())

# 均匀分布
a = torch.Tensor(2, 2).uniform_(-1, 1)	# 先指定shape再均匀分布
print(a)
print(a.type())

# 序列
a = torch.arange(0, 11, 2)	# 指定步长
print(a)
print(a.type())

a = torch.linspace(0, 11, 5)	# 指定序列长度
print(a)
print(a.type())

# 随机序列
a = torch.randperm(10)
print(a)
print(a.type())
```
#### Tensor的属性

- torch.dtype：表示张量的数据类型
- torch.device：表示存储该张量的设备名称（默认"cpu"）
- torch.layout：表示张量内存布局的对象（稀疏、稠密等）

**稀疏张量**：仅存储非零元素的索引和值，可以减少内存开销。

```python
# 指定device时，应使用tensor而非Tensor来创建张量对象

# 指定device
a = torch.tensor([2, 2], device="cpu")
print(a)
print(a.device)

a = torch.tensor([2, 2], device="cuda:0")	# 赋值"cuda"时，默认存储在"cuda:0"
print(a)
print(a.device)

# 指定dtype
a = torch.tensor([2, 2])
print(a)
print(a.dtype)

a = torch.tensor([2, 2], dtype=torch.float32)
print(a)
print(a.dtype)

# 定义稀疏张量
i = torch.tensor([[0, 1, 2], [0, 1, 2]])	# 用于存储非零元素的索引(X, Y)
v = torch.tensor([1, 2, 3])		# 用于存储非零元素的值
a = torch.sparse_coo_tensor(i, v, (4, 4))	# 指定张量的shape
print(a)

# 稀疏张量转稠密张量
a = torch.sparse_coo_tensor(i, v, (4, 4)).to_dense()
print(a)
```
#### Tensor的运算

in-place操作：相应的运算加"_"，直接把运算后的值赋给张量对象，但需满足二者的维度与数据类型相同。

```python
# 加法运算
a = torch.rand(2, 2)
b = torch.rand(2, 2)
print(a)
print(b)
print(a + b)
print(torch.add(a, b))
print(a.add(b))
print(a.add_(b))	# in-place操作，无需临时变量，直接把运算后的值赋给a
print(a)

# 减法运算
a = torch.rand(2, 2)
b = torch.rand(2, 2)
print(a)
print(b)
print(a - b)
print(torch.sub(a, b))
print(a.sub(b))
print(a.sub_(b))	# in-place操作，无需临时变量，直接把运算后的值赋给a
print(a)

# 乘法运算（点乘）
a = torch.rand(2, 2)
b = torch.rand(2, 2)
print(a)
print(b)
print(a * b)
print(torch.mul(a, b))
print(a.mul(b))
print(a.mul_(b))	# in-place操作，无需临时变量，直接把运算后的值赋给a
print(a)

# 除法运算
a = torch.rand(2, 2)
b = torch.rand(2, 2)
print(a)
print(b)
print(a / b)
print(torch.div(a, b))
print(a.div(b))
print(a.div_(b))	# in-place操作，无需临时变量，直接把运算后的值赋给a
print(a)

# 矩阵乘法
# 矩阵乘法没有in-place操作，因为运算后的结果的维度与输入Tensor的维度不一定相同
a = torch.rand(2, 1)
b = torch.rand(1, 2)
print(a)
print(b)
print(a @ b)
print(torch.matmul(a, b))
print(torch.mm(a, b))	# mm为matmul的缩写
print(a.mm(b))
# 对于高维度的Tensor，仅对最后两个维度进行矩阵乘法，前面的维度必须保持一致
a = torch.ones(1, 2, 3, 4)
b = torch.ones(1, 2, 4, 3)
print(a @ b)

# 幂运算
a = torch.rand(2, 2)
print(a)
print(a ** 2)
print(torch.pow(a, 2))
print(a.pow(2))
print(a.pow_(2))	# in-place操作，无需临时变量，直接把运算后的值赋给a
print(a)

# 指数运算
a = torch.rand((2, 2), dtype=torch.float32)     # 指数对数据类型有要求
print(a)
print(torch.exp(a))
print(a.exp())
print(a.exp_())		# in-place操作，无需临时变量，直接把运算后的值赋给a
print(a)

# 开方运算
a = torch.tensor([[1, 2], [3, 4]], dtype=torch.float32)
print(a)
print(torch.sqrt(a))
print(a.sqrt())
print(a.sqrt_())		# in-place操作，无需临时变量，直接把运算后的值赋给a
print(a)

# 对数运算
a = torch.tensor([[1, 2], [3, 4]], dtype=torch.float32)
print(a)
print(torch.log2(a))
print(torch.log10(a))
print(torch.log(a))		# 以e为底的对数
print(torch.log_(a))	# in-place操作，无需临时变量，直接把运算后的值赋给a
print(a)
```