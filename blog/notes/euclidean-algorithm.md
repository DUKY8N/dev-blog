---
title: "유클리드 호제법으로 최대공약수 구하기"
description: "유클리드 호제법의 원리와 두 수 및 여러 수의 최대공약수를 구하는 방법."
date: "2026-08-08T09:00:00+09:00"
tags: [algorithm, math]
---

최대공약수(GCD, Greatest Common Divisor)는 두 수를 모두 나누어떨어지게 하는 수 중 가장 큰 수다. 유클리드 호제법은 나머지를 이용해 최대공약수를 구하는 방법이다.

- **호(互)**: 서로
- **제(除)**: 나누다, 덜어내다
- **법(法)**: 방법

---

두 자연수 $a$, $b$가 있고 $a > b$일 때, $a$를 $b$로 나눈 나머지를 $r$이라고 하자.

$$
a = bq + r
$$

$a$와 $b$의 공약수는 $b$와 $r$의 공약수와 같다. 따라서 다음과 같이 더 작은 수의 조합으로 문제를 바꿀 수 있다.

$$
gcd(a, b) = gcd(b, a \bmod b)
$$

나머지가 $0$이 되면, 그때의 $a$가 최대공약수다.

```python
def gcd(a, b):
    return a if b == 0 else gcd(b, a % b)

assert gcd(48, 18) == 6
```

`b`가 0이 될 때까지 `gcd(b, a % b)`를 재귀 호출한다. `gcd(18, 48)`처럼 작은 수를 먼저 넣어도 첫 재귀 호출에서 `gcd(48, 18)`로 바뀌므로 순서는 상관없다.

---

## 여러 수의 최대공약수

세 수 이상의 최대공약수도 두 수의 최대공약수를 순차적으로 구하면 된다.

$$
gcd(a, b, c) = gcd(gcd(a, b), c)
$$

```python
def gcd_n(numbers):
    result = numbers[0]

    for number in numbers[1:]:
        result = gcd(result, number)

    return result

assert gcd_n([48, 18, 30]) == 6
```

---

유클리드 호제법은 나머지를 반복해 문제의 크기를 줄이는 알고리즘이다. 최대공약수나 [최소공배수](/blog/notes/least-common-multiple/)를 구해야 하는 문제에서 기본 도구로 활용할 수 있다.
