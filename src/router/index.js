import { createRouter, createWebHistory } from 'vue-router';
import Lock from '../views/Lock.vue';
import Menu from '../views/Menu.vue';
import Comic from '../views/Comic.vue';
import Invitation from '../views/Invitation.vue';
import Game from '../views/Game.vue';
import Camera from '../views/Camera.vue';
import CrosswordGame from '../views/CrosswordGame.vue';

const routes = [
  { path: '/', name: 'Lock', component: Lock },
  { path: '/menu', name: 'Menu', component: Menu },
  { path: '/comic', name: 'Comic', component: Comic },
  { path: '/invitation', name: 'Invitation', component: Invitation },
  { path: '/game', name: 'Game', component: Game },
  { path: '/camera', name: 'Camera', component: Camera },
  { path: '/crossword', name: 'Crossword', component: CrosswordGame },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
