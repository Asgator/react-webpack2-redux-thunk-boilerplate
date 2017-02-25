# кодстайл react-компонентов

чтобы меньше букв писать, делаем так:

```
import React, { Component } from 'react';
```

чтобы уменьшиеть количество ререндеров компонента нужно использовать:

```
import React, { PureComponent } from 'react';
```

Так как `react-addons-shallow-compare` устарел

для определения типов props юзаем Flow:

```
type Props = {
  id: number
};

class MyComponent extends Component {
  props:Props;
}
```

лучше абстрагировать компонент от объекта и передавать в него только нужные именно этому компоненту поля. в camelCase:

```
props: {
  isFoo: boolean,
  someField: string
}
```

# прочие настройки .eslintrc
помимо всего прочего, в пятницу мы включили в конфиг вебпака `.eslintrc`, в котором проверяются некоторые вещи, в т.ч.:
- большое количество правил от airbnb
- имена обработчиков событий (`on*` для внешних props, `handle*` для внутренних)

(на всё это будет ругаться webpack при сборке и в консоли браузера при разработке)

# структура папочек

**actions**
>Redux экшены

**reducers**
>Redux редюсеры

**store**
>Конфигурация redux стора

**types**
>Внутренние реиспользуемые типы (Flow) сущьностей

**utils**
>Реиспользуемые функции

**enhancers**
>Обёртки над компонентами

**constants**
>Константы проекта, также там хранятся константые для экшенов

**elements**
>абсолютно независимые компоненты типа кнопочек-с-иконками, совсем-кастомных-дропдаунов и прочего. подразумевается, что их будет довольно мало

**modules**
>реюзаемые комбинации простых компонентов, например: блок контактной информации, модальное окно, реюзаемая каруселька etc.

**views**
>комбинация нескольких модулей, связанных одной большой сущностью, например карточка вакансии или компании

**containers**
>прослойки между роутером и views, которые работают с данными: передают во views данные из сторов и вызывают redux-экшены при срабатывании во views событий

**pages**
>страницы, могут иметь свои приватные контейнеры и компоненты, как только контейнер или компонент реиспользуется, его стоит вынести в соответствующую папку. (containers/components)

```
actions:
  vacancies.js // API получение вакансий
  vacancies-state.js // API состояние вакансии
  page-company-card.js // Работа с внутренним состоянием страницы, без использования API

reducers:
  index.js
  vacancies:
    index.js
    entities.js // Хранятся все полученые вакансии под id
    list.js // Хранятся список id вакансий в том порядке, который пришёл с API
    loading.js // Загрузка конкретной вакансии по id
    errors.js // Ошибки конкретной вакансии по id
  pages: // Состояние для конерктной страницы
    company-card.js
    vacancy-card.js

constants:
  user.js
  actions: // Константы для Redux экшенов
    vacancies.js
    user.js

components:
  elements:
    my-element-1:
      index.js
      styles.less
      img:
        my-img-1.png
  modules:
    my-module-1:
      index.js
      styles.less
      img:
        my-img-1.png
  views:
    my-view-1:
      index.js
      styles.less
      img:
        my-img-1.png
      my-private-component:
        index.js
        styles.less
        img:
          my-img-1.png

containers:
  my-container-1
    index.js
    ?selectors.js
    ?validate.js // Для валидации Redux-form
    styles.less
    img:
      my-img-1.png

pages:
  my-page-1
    index.js
    styles.less
    containers:
      my-private-container-1
        index.js
        styles.less
        img:
          my-img-1.png
    elements:
      my-private-element-1
        index.js
        styles.less
        img:
          my-img-1.png
    views:
      my-private-view-1:
        index.js
        styles.less
        img:
          my-img-1.png
        my-private-component:
          index.js
          styles.less
          img:
          my-img-1.png

index.js // Точка входа проекта
routes.js // Прописание путей страниц
test.js // Точка входа для тестов
```

насчёт внутренних компонентов, так:

```
modules:
  my-custom-module:
    index.js
    private-sub-module:
      index.js
```

или так:

```
modules:
  my-custom-module:
    index.js
    private-sub-module.js
```
