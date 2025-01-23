## 사용한 언어, 프레임워크, 개발 도구

- TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Docker
- Docker Compose
- Jest

## 로컬 프로젝트 실행 방법

1. 해당 명령어를 통해 local-db를 실행합니다.

```
yarn docker:up:local
```

2. Dependencies 설치

```
yarn install
```

3. 서버 실행

```
yarn start:local
```

4. docker-compose 중지

```
yarn docker:down:local
```

## 테스트 계정

- yarn seed 명령어를 통해 테스트 계정을 생성합니다.

```
yarn seed
```

<br>

- 개인 회원 계정

```
email: 'test@test.com'
password: 'test'
```

- 법인 회원 계정

```
email: 'test2@test.com'
password: 'test'
```

<br>

## 테스트 코드 실행 방법

1. 테스트 용 docker-compose 실행

```
yarn docker:up:local-test
```

2. 테스트 코드 실행

```
yarn test
```

3. 테스트 용 docker-compose 중지

```
yarn docker:down:local-test
```

<br>

## API 명세서

https://documenter.getpostman.com/view/13091019/2sAYQfC8eX

<br>

## 설계 및 패턴

### 주요 설계 특징

A. 모듈화 (Modularity)

- 각 기능별로 독립적인 모듈로 분리
- 기능 확장과 유지보수가 용이
- 높은 응집도와 낮은 결합도

B. Global Core Module

- 공통 기능들을 CoreModule로 중앙화
- 트랜잭션 관리, 설정, JWT, 인터셉터 등 공통 기능 제공
- 중복 코드 방지와 일관된 정책 적용 가능

C. 제네릭 리포지토리 패턴

- 공통 CRUD 작업을 제네릭 리포지토리로 추상화
- 코드 재사용성 증가
- 일관된 데이터 접근 패턴 제공

D. 트랜잭션 관리

- 전역 트랜잭션 미들웨어를 통한 일관된 트랜잭션 관리
- 데이터 일관성 보장
- 트랜잭션 관리 코드의 중복 제거

E. 인터셉터 활용

- 응답 형식 표준화
- 전역 에러 처리
- Cross-cutting Concerns 효과적 처리

F. 보안

- JWT 기반 인증
- 가드를 통한 접근 제어
- 보안 정책의 중앙화된 관리

<br>

### 송금 견적서 생성 기능 구현 시, 고민했던 점

```typescript
async createQuote(userId: User['id'], body: CreateQuoteBody) {

  const { amount, targetCurrency } = body;
  const strategy = this.quoteStrategyFactory.getQuoteStrategy(targetCurrency);
  const quoteData = await strategy.makeQuote(userId, amount);
  // ...
}
```

송금 견적서 생성 기능을 구현하면서 JPY와 USD 등 서로 다른 통화에 대해 견적을 계산하는 로직이 각기 다르다는 점이 고민이 되었습니다. 각 통화마다 환율, 수수료, 최종 금액 계산 방식 등이 상이하기 때문에 이를 하나의 클래스에서 처리하려고 하면 코드의 복잡도가 증가하고, 유지보수가 어려워질 것이라 생각하였습니다.

해당 문제를 해결하기 위해 **전략 패턴(Strategy Pattern)**을 적용했습니다. 전략 패턴을 통해 통화별 계산 로직을 별도의 클래스(JpyQuoteCalculatorStrategy, UsdQuoteCalculatorStrategy)로 캡슐화했을 때, 다음과 같은 이점을 얻을 수 있다고 생각합니다.

<br>

1. 확장성:
   새로운 통화가 추가되거나 기존 계산 방식이 변경되더라도 기존 코드를 수정하지 않고, 새로운 전략 클래스를 추가하기만 하면 됩니다. 예를 들어, EUR 또는 GBP에 대한 견적 계산이 필요할 경우, 해당 통화에 대한 전략 클래스를 생성하고 팩토리에 추가하면 손쉽게 기능을 확장할 수 있습니다.

2. 유지보수성:
   각 통화의 계산 로직이 독립적으로 관리되므로, 특정 통화 로직을 수정해도 다른 통화 로직에 영향을 주지 않습니다. 또한, 공통 로직(예: 환율 조회, 수수료 계산 등)은 별도의 서비스(ExchangeRateService, FeeService)로 분리해 재사용성을 높였습니다.

3. 테스트 용이성:
   전략 클래스를 독립적으로 테스트할 수 있어, 통화별 로직에 대한 단위 테스트 작성이 쉬워졌습니다.

<br>

### 송금 견적서 생성 기능 구현 시, 고민했던 점

```typescript
  async requestTransfer(
    userId: User['id'],
    idType: User['idType'],
    quoteId: Quote['id'],
  ) {
    const quote = await this.quoteRepository.findByIdOrThrow(quoteId);

    // 견적서 만료 검증
    if (quote.isExpired()) throw new QuoteExpiredException();

    // 일일 이체 한도 검증
    await this.requestTransferPolicy.validateDailyTransferLimit(userId, idType);

    // ....
  }
```

송금 접수 요청 기능에서 "일일 송금 한도 검증"과 같은 정책 관련 로직을 requestTransfer 서비스에 포함할 경우, 코드의 양이 많아지고 가독성과 유지보수성이 저하될 수 있다고 판단했습니다. 또한, 송금 처리를 담당하는 TransferService에 정책 검증 로직을 포함시키는 것은 책임 분리의 원칙에도 부합하지 않다고 보았습니다.

이를 해결하기 위해, 정책 검증 로직을 **RequestTransferPolicy**라는 별도의 서비스로 분리하여 정책 검증과 송금 처리의 역할을 명확히 분리했습니다.

이와 같이 구현했을 경우, 다음과 같은 이점이 있다고 생각합니다.

1. 책임 분리:
   TransferService는 송금 처리에 집중하고, 정책 검증은 RequestTransferPolicy가 전담하도록 역할을 분리했습니다. 이를 통해 각 클래스가 단일 책임을 가지도록 설계했으며, 코드의 명확성과 유지보수성을 향상시킬 수 있습니다.

2. 테스트 용이성:
   정책 검증 로직이 독립적으로 분리되었기 때문에, 비즈니스 정책에 대한 손쉬운 검증이 가능합니다.

<br>

### 테스트 코드 작성 시, 고민했던 점

일일 이체 한도 검증, 수수료 계산, 환율 계산과 같은 로직이 각 책임에 맞는 클래스들로 분리되어 있었기 때문에, 테스트 코드를 용이하게 작성할 수 있었습니다. 위와 같은 부분들은 unit test를 통해 다양한 케이스에 대한 검증을 진행하였습니다.

비즈니스 로직을 담당하는 서비스 메서드의 경우, 데이터베이스 계층까지 포함한 검증을 위해 통합 테스트를 작성했습니다. 이를 위해 로컬 테스트용 Docker Compose 파일을 생성하여, 테스트 전용 데이터베이스 환경을 손쉽게 설정하고 사용할 수 있도록 구성했습니다.

테스트 간 독립성을 보장하기 위해, 테스트 데이터 초기화를 수행하는 코드를 작성했습니다. 또한, 테스트 데이터를 효율적으로 생성하기 위해 test/factory 폴더에 팩토리 클래스를 구현했습니다. 이 팩토리 클래스는 필요한 테스트 데이터를 손쉽게 생성할 수 있도록 설계되어, 테스트 코드 작성과 유지보수를 더욱 편리하게 만들어주는 장점이 있습니다.
