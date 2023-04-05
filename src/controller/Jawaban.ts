import { Router, Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

import { prismaClient } from '../config';
import { returnResponse} from '../interface';

const router = Router();

let resObject: returnResponse;

router.post('/:id_soal', body('jawaban').isString().isLength({ max: 15 }), async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const { id, create_at, update_at, jawaban, ...body } = req.body;
        
        const { id_soal }: any = req.params;

        const createJawaban = await prismaClient.jawaban.create({
          data: {
            jawaban,
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
                    pilihan_ganda: {
                        select: {
                            pilihan_A: true,
                            pilihan_B: true,
                            pilihan_C: true,
                            pilihan_D: true,
                        }
                    },
                }
            },
            jawaban: true,
          },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Jawaban berhasil dibuat',
            data: createJawaban,
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

router.put('/:id_ubah_Jawaban', body('jawaban').isString().isLength({ max: 15 }), async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const { id, create_at, update_at, jawaban, ...body } = req.body;
  
        const { id_ubah_Jawaban }: any = req.params;
  
        const updateJawaban= await prismaClient.jawaban.update({
          where: {
            id: Number(id_ubah_Jawaban),
          },
          data: {
            jawaban,
            ...body,
          },
          select: {
            soal_id: {
                select: {
                    soal: true,
                    pilihan_ganda: {
                        select: {
                            pilihan_A: true,
                            pilihan_B: true,
                            pilihan_C: true,
                            pilihan_D: true,
                        }
                    },
                }
            },
            jawaban: true,
          },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Jawaban berhasil diupdate',
            data: updateJawaban,
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
        const rows = await prismaClient.jawaban.findMany({
            select: {
                soal_id: {
                    select: {
                        soal: true,
                        pilihan_ganda: {
                            select: {
                                pilihan_A: true,
                                pilihan_B: true,
                                pilihan_C: true,
                                pilihan_D: true,
                            }
                        },
                    }
                },
                jawaban: true
              },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Get All Jawaban',
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
  
          const row = await prismaClient.jawaban.findUnique({
            where: {
              id: Number(id),
            },
            select: {
                soal_id: {
                    select: {
                        soal: true,
                        pilihan_ganda: {
                            select: {
                                pilihan_A: true,
                                pilihan_B: true,
                                pilihan_C: true,
                                pilihan_D: true,
                            }
                        },
                    }
                },
                jawaban: true
              },
          });
  
          resObject = {
            statuscode: 200,
            data: {
              message: 'Get Jawaban',
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

        const deleteJawaban = await prismaClient.jawaban.delete({
          where: {
            SoalId: Number(id_hapus),
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Jawaban di hapus',
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