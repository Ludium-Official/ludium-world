UPDATE tb_mdl
   SET category = 'MODULE'
 WHERE id IN (SELECT id
                FROM tb_art
               WHERE category = 'MODULE');
 
UPDATE tb_mdl
   SET category = 'MISSION'
 WHERE id IN (SELECT id
                FROM tb_art
               WHERE category = 'MAKE');