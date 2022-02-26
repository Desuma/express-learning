import { getStartParams, crreateApp } from './app';

const { AppPort } = getStartParams();

crreateApp(AppPort);