import unittest,sys,tempfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from engine import Engine

class TestVisualSettings(unittest.TestCase):
    def test_motion_choice_is_persistent_and_invalid_choice_is_normalized(self):
        with tempfile.TemporaryDirectory() as folder:
            p=Path(folder)/'session.json';e=Engine(storage=p);e.command('settings',{'visualMotion':'soft'});self.assertEqual(Engine(storage=p).settings['visualMotion'],'soft');e.command('settings',{'visualMotion':'valor inválido'});self.assertEqual(e.settings['visualMotion'],'vivid')
    def test_palette_and_ticker_settings_persist(self):
        with tempfile.TemporaryDirectory() as folder:
            p=Path(folder)/'session.json';e=Engine(storage=p);e.command('settings',{'visualPalette':'sunset','tickerEnabled':False,'tickerSpeed':'fast'});saved=Engine(storage=p).settings;self.assertEqual(saved['visualPalette'],'sunset');self.assertFalse(saved['tickerEnabled']);self.assertEqual(saved['tickerSpeed'],'fast')
    def test_unknown_palette_and_speed_fall_back_to_defaults(self):
        e=Engine();e.command('settings',{'visualPalette':'inválida','tickerSpeed':'inválida'});self.assertEqual(e.settings['visualPalette'],'party');self.assertEqual(e.settings['tickerSpeed'],'normal')
    def test_rank_animation_identity_does_not_merge_equal_names(self):
        e=Engine();e.scores={'u1':{'name':'Ana','hits':2,'points':200},'u2':{'name':'Ana','hits':1,'points':150}}
        rank=e.snapshot()['rank'];self.assertEqual([r['playerId'] for r in rank],['u1','u2']);self.assertEqual(len(rank),2)

if __name__=='__main__':unittest.main()
