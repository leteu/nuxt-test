<template>
  <div>
    <div>
      page: {{ page }}
    </div>
    <div class="card-container">
      <template v-for="(item, index) in todos" :key="`post-${index}`">
        <div class="card" @click="goDetail(item.id)">
          <div>
            {{ item.title }}
          </div>
          <div class="card__completed" v-if="item.completed">
            <img src="/check.svg" alt="">
          </div>
        </div>
      </template>
    </div>
    <div class="pagination">
      <div class="pagination__btn" @click="onClickPagination('first')">&lt;&lt;</div>
      <div class="pagination__btn" @click="onClickPagination('prev')">&lt;</div>
      <template v-for="(btn, index) in total">
        <div
          class="pagination__btn"
          :class="{
            'active': btn === page
          }"
          @click="onClickPagination(btn)"
        >
          {{ btn }}
        </div>
      </template>
      <div class="pagination__btn" @click="onClickPagination('next')">&gt;</div>
      <div class="pagination__btn" @click="onClickPagination('last')">&gt;&gt;</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

const config = useRuntimeConfig()
const router = useRouter()

const page = ref(1)

const { data: todos } = await useAsyncData<Todo[]>(
  'todos',
  () => $fetch(
    `/todos?_page=${page.value}&_limit=20`,
    {
      baseURL: config.public.apiBase
    }
  ),
  {
    watch: [page]
  }
)

const { data: total } = await useAsyncData(
  'total',
  async () => {
    const res = await $fetch.raw(
      '/todos?_page=0&_limit=0',
      {
        baseURL: config.public.apiBase
      }
    )

    return Math.ceil(Number(res.headers.get('X-Total-Count')) / 20)
  },
  {
    default: () => 0
  }
)

const onClickPagination = (target: number | 'first' | 'prev' | 'next' | 'last') => {
  if (typeof target === 'number') {
    page.value = target
    return
  }

  switch (target) {
    case 'first': {
      page.value = 0
      break
    }
    case 'prev': {
      page.value = page.value - 1 <= 1 ? 1 : page.value - 1
      break
    }
    case 'next': {
      page.value = page.value + 1 >= total.value ? total.value : page.value + 1
      break
    }
    case 'last': {
      page.value = total.value
      break
    }
  }
}

const goDetail = (id: number) => {
  router.push(`/detail/${id}`)
}
</script>

<style lang="sass">
.card-container
  display: grid
  grid-template-columns: repeat(8, 1fr)
  gap: 16px
  margin-top: 16px
  .card
    position: relative
    background: #fff
    height: 50px
    border-radius: 15px
    border: 1px solid #ccc
    padding: 16px
    transition: transform 0.5s
    &:hover
      transform: translateY(-4px)
      cursor: pointer
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.35)
    &__completed
      position: absolute
      width: 24px
      height: 24px
      border-radius: 50%
      top: -10px
      right: -10px
      background: #0f0
      display: flex
      align-items: center
      justify-content: center
      > img
        width: 80%
        height: 80%

.pagination
  display: flex
  align-items: center
  justify-content: center
  gap: 8px
  margin-top: 16px
  &__btn
    width: 40px
    height: 40px
    border-radius: 50%
    border: 1px solid #ccc
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer
    &.active
      border-color: #00f
      color: #00f
</style>