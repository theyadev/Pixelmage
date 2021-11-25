<template>
    <div class="bg-white">
        <div v-for="user in users" :key="user">aaa</div>
    </div>
        
</template>

<script>
export default {
    props:["users"],
}
</script>


<style>

</style>