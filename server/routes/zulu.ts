import { Router } from 'express';
import { getZuluBrief } from '../modules/zulu/zulu.brief';

const router = Router();

// GET /api/zulu/brief - system health + update info
router.get('/brief', async (req, res) => {
  try {
    const brief = await getZuluBrief();
    res.json({ ok: true, brief });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to get Zulu brief', details: String(err) });
  }
});

// POST /api/zulu/update - run update for a package or all
router.post('/update', async (req, res) => {
  const { pkg } = req.body || {};
  try {
    let result;
    if (pkg && typeof pkg === 'string') {
      result = require('child_process').execSync(`npm update ${pkg}`, { encoding: 'utf8', timeout: 20000 });
    } else {
      result = require('child_process').execSync('npm update', { encoding: 'utf8', timeout: 60000 });
    }
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Update failed', details: String(err) });
  }
});

export default router;
