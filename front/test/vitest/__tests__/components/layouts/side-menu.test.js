import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "src/components/layouts/SideMenu.vue";

// Mock du router
const routes = [
  { path: "/", component: { template: "<div>Home</div>" } },
  { path: "/admin/enterprise", component: { template: "<div>Admin</div>" } },
  { path: "/admin/establishments", component: { template: "<div>Establishments</div>" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe("SideMenu.vue", () => {
  let wrapper;

  beforeEach(async () => {
    router.push("/");
    await router.isReady();

    wrapper = mount(SideMenu, {
      global: {
        plugins: [router],
      },
    });

    wrapper.vm.$nextTick();
  });

  it("doit afficher tous les éléments du menu", () => {
    const menuItems = wrapper.findAll(".menu-item");
    expect(menuItems.length).toBe(2);
  });

  it("doit ajouter la classe active au menu actif", async () => {
    await router.push("/admin/enterprise");
    await wrapper.vm.$nextTick();

    const activeItem = wrapper.find(".menu-item-active");
    expect(activeItem.exists()).toBe(true);
  });

  it("doit naviguer vers une autre page au clic sur un élément du menu", async () => {
    const adminMenu = wrapper.findAll(".menu-item")[1];
    await adminMenu.trigger("click");

    await router.isReady();
    expect(router.currentRoute.value.path).toBe("/admin/enterprise");
  });

  it("doit ouvrir et fermer un sous-menu", async () => {
    const adminMenu = wrapper.findAll(".menu-item")[1];

    // Vérifie que le sous-menu n'est pas affiché au départ
    expect(wrapper.find(".submenu").exists()).toBe(false);

    // Clique sur l'élément du menu pour ouvrir le sous-menu
    await adminMenu.trigger("click");
    await wrapper.vm.$nextTick();

    // Vérifie que le sous-menu est maintenant visible
    expect(wrapper.find(".submenu").exists()).toBe(true);

    // Clique à nouveau pour fermer le sous-menu
    await adminMenu.trigger("click");
    await wrapper.vm.$nextTick();

    // Vérifie que le sous-menu est caché à nouveau
    expect(wrapper.find(".submenu").exists()).toBe(false);
  });

  it("doit rafraîchir la clé si on clique sur le même lien actif", async () => {
    const refreshKeyBefore = wrapper.vm.refreshKey;
    const homeMenu = wrapper.findAll(".menu-item")[0];

    await homeMenu.trigger("click");
    expect(wrapper.vm.refreshKey).toBe(refreshKeyBefore + 1);
  });
});


