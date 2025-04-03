---
layout: single
title: "如何让 Enum 被 JSON 正确序列化"
date: 2025-4-4 12:00:00 +0000
categories: tutorial
tags: [blog, tutorial, python]
permalink: /:categories/:year/:month/:day/:title.html
---


在使用 Python 编程时，我们经常用枚举（`Enum`）来表示一组固定的选项，比如不同的模型类型、运行模式或者数据格式。但有时我们需要把这些配置信息保存为 JSON 文件，这时候如果直接使用 `json.dumps()` 来序列化一个包含枚举的对象，就可能报错：

```
TypeError: Object of type XXX is not JSON serializable
```

这个错误的意思是：Python 不知道怎么把这个枚举值转换成 JSON 格式。

---

## 最简单的解决方法：让枚举继承 `str`

为了让枚举值在序列化时像字符串一样被处理，我们可以在定义枚举类时，让它同时继承 `str` 和 `Enum`。这样一来，枚举成员就会变成“字符串类型的枚举”，可以直接被 `json.dumps()` 正确处理。

### 示例

```python
from enum import Enum

class Mode(str, Enum):
    TRAIN = "train"
    TEST = "test"
```

使用时：

```python
import json

config = {"mode": Mode.TRAIN}
json_string = json.dumps(config)
print(json_string)  # 输出：{"mode": "train"}
```

### 为什么这样就能用了？

因为这个枚举类继承了 `str`，所以每个枚举值在本质上就是一个字符串。Python 的 `json` 模块能自动识别字符串，因此就可以直接序列化，不会报错。

---

## 小结

| 方法                      | 推荐程度 | 说明                          |
|---------------------------|----------|-------------------------------|
| 继承 `str` 和 `Enum`      | ✅ 推荐   | 简洁直观，能自动被 JSON 支持   |
| 使用 `default` 参数自定义 | ⚠️ 备选   | 需要写额外的转换逻辑，略复杂    |

如果你在写项目或实验脚本，想让配置文件更清晰、序列化更方便，建议统一使用继承 `str` 的方式来定义你的枚举类型。
