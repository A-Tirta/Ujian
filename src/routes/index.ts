import { Router } from 'express';

const routes = Router();

import status from '../controller/status';
routes.use('/status', status);

import matapelajaran from '../controller/MataPelajaran';
routes.use('/matapelajaran', matapelajaran);

import soal from '../controller/Soal';
routes.use('/soal', soal);

import pilihanganda from '../controller/PilihanGanda';
routes.use('/pilihanganda', pilihanganda);

import jawaban from '../controller/Jawaban';
routes.use('/jawaban', jawaban);

export default routes