import { Router, Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

import { prismaClient } from '../config';
import { returnResponse} from '../interface';

const router = Router();

let resObject: returnResponse;
  
router.post('/:id_soal', body(['pilihan_A', 'pilihan_B', 'pilihan_C', 'pilihan_D']).isString().isLength({ max: 15 }), async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const { id, create_at, update_at, pilihan_A, pilihan_B, pilihan_C, pilihan_D, ...body } = req.body;
        
        const { id_soal }: any = req.params;

        const createPilihanGanda = await prismaClient.pilihanGanda.create({
          data: {
            pilihan_A,
            pilihan_B,
            pilihan_C,
            pilihan_D,
            soal_id: {
                connect: {
                    id: Number(id_soal)
                }
            },
            ...body,
          },
          select: {
            soal_id: {
                select: {
                    soal: true,
                }
            },
            pilihan_A: true,
            pilihan_B: true,
            pilihan_C: true,
            pilihan_D: true,
          },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Pilihan Ganda berhasil dibuat',
            data: createPilihanGanda,
          },
        };
      } catch (error) {
        console.log(error);
  
        resObject = {
          statuscode: 500,
          data: {
            message: 'Ada sesuatu yang salah dari server',
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: 'Form masih ada yang kurang, coba cek lagi',
          info: err.array(),
        },
      };
    }
  
    return res.status(resObject.statuscode).json(resObject.data);
});
  
router.put('/:id_ubah_Pilihan_Ganda', body(['pilihan_A', 'pilihan_B', 'pilihan_C', 'pilihan_D']).isString().isLength({ max: 15 }), async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const { id, create_at, update_at, pilihan_A, pilihan_B, pilihan_C, pilihan_D, ...body } = req.body;
  
        const { id_ubah_Pilihan_Ganda }: any = req.params;
  
        const updatePilihanGanda = await prismaClient.pilihanGanda.update({
          where: {
            id: Number(id_ubah_Pilihan_Ganda),
          },
          data: {
            pilihan_A,
            pilihan_B,
            pilihan_C,
            pilihan_D,
            ...body,
          },
          select: {
            soal_id: {
                select: {
                    soal: true,
                    jawaban: {
                      select: {
                        jawaban: true,
                      }
                    },
                }
            },
            pilihan_A: true,
            pilihan_B: true,
            pilihan_C: true,
            pilihan_D: true,
          },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Pilihan Ganda berhasil diupdate',
            data: updatePilihanGanda,
          },
        };
  
      } catch (error) {
        console.log(error);
  
        resObject = {
          statuscode: 500,
          data: {
            message: 'Ada sesuatu yang salah dari server',
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: 'Form masih ada yang kurang, coba cek lagi',
          info: err.array(),
        },
      };
    }
  
    return res.status(resObject.statuscode).json(resObject.data);
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const rows = await prismaClient.pilihanGanda.findMany({
            select: {
                soal_id: {
                    select: {
                        soal: true,
                        jawaban: true,
                    }
                },
                pilihan_A: true,
                pilihan_B: true,
                pilihan_C: true,
                pilihan_D: true,
              },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Get All Pilihan Ganda',
            data: rows,
          },
        };
      } catch (error) {
        console.log(error);
  
        resObject = {
          statuscode: 500,
          data: {
            message: 'Ada sesuatu yang salah dari server',
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: 'Form masih ada yang kurang, coba cek lagi',
          info: err.array(),
        },
      };
    }
  
    return res.status(resObject.statuscode).json(resObject.data);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const { id }: any = req.params;
  
          const row = await prismaClient.pilihanGanda.findUnique({
            where: {
              id: Number(id),
            },
            select: {
                soal_id: {
                    select: {
                        soal: true,
                        jawaban: true,
                    }
                },
                pilihan_A: true,
                pilihan_B: true,
                pilihan_C: true,
                pilihan_D: true,
              },
          });
  
          resObject = {
            statuscode: 200,
            data: {
              message: 'Get Pilihan Ganda',
              data: row,
            },
          };
      } catch (error) {
        console.log(error);
  
        resObject = {
          statuscode: 500,
          data: {
            message: 'Ada sesuatu yang salah dari server',
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: 'Form masih ada yang kurang, coba cek lagi',
          info: err.array(),
        },
      };
    }
  
    return res.status(resObject.statuscode).json(resObject.data);
});

router.delete('/:id_hapus', async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    try {
      const { id_hapus }: any = req.params;

        const deletePilihanGanda = await prismaClient.pilihanGanda.delete({
          where: {
            SoalId: Number(id_hapus),
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Pilihan Ganda di hapus',
          },
        };
    } catch (error) {
      console.log(error);

      resObject = {
        statuscode: 500,
        data: {
          message: 'Ada sesuatu yang salah dari server',
        },
      };
    }
  } else {
    resObject = {
      statuscode: 400,
      data: {
        message: 'Form masih ada yang kurang, coba cek lagi',
        info: err.array(),
      },
    };
  }

  return res.status(resObject.statuscode).json(resObject.data);
});

export default router;