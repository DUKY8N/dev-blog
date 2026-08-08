---
title: "최대공약수로 최소공배수 구하기"
description: "최대공약수와 최소공배수의 관계를 이용해 두 수 및 여러 수의 최소공배수를 구하는 방법."
date: "2026-08-08T10:00:00+09:00"
tags: [algorithm, math]
---

최소공배수(LCM, Least Common Multiple)는 두 수의 공통 배수 중 가장 작은 수다.

최대공약수(GCD)와 최소공배수는 다음 관계식으로 연결된다. 최대공약수는 [유클리드 호제법](/blog/notes/euclidean-algorithm/)으로 구할 수 있다.

$$
lcm(a, b) = \frac{|a \cdot b|}{gcd(a, b)}
$$

```python
from math import gcd

def lcm(a, b):
    return a * b // gcd(a, b)

assert lcm(12, 18) == 36
```

코딩 테스트에서는 대부분 양의 정수가 주어지므로 절댓값 기호는 생략할 수 있다.

---

## 여러 수의 최소공배수

세 수 이상의 최소공배수도 두 수씩 순차적으로 구하면 된다.

$$
lcm(a_1, a_2, a_3, a_4) = lcm(lcm(lcm(a_1, a_2), a_3), a_4)
$$

```python
def lcm_n(numbers):
    result = numbers[0]

    for number in numbers[1:]:
        result = lcm(result, number)

    return result

assert lcm_n([4, 6, 8]) == 24
```

---

최대공약수를 구할 수 있다면, 이 관계식을 이용해 최소공배수도 함께 구할 수 있다.
