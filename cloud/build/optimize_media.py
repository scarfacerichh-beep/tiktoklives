from pathlib import Path
import subprocess,json
source=Path('/workspace/work/luna-heygen-production/luna-opening.mp4')
out=Path('/workspace/work/luna-heygen-production/luna-opening-web.mp4')
if not out.exists():
 subprocess.run(['ffmpeg','-nostdin','-v','error','-n','-i',str(source),'-map','0:v:0','-map','0:a:0','-c:v','libx264','-preset','medium','-crf','24','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(out)],check=True)
poster=out.with_name('luna-poster-web.jpg')
if not poster.exists():subprocess.run(['ffmpeg','-nostdin','-v','error','-n','-ss','16','-i',str(source),'-frames:v','1','-q:v','3',str(poster)],check=True)
def probe(p):return json.loads(subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)],capture_output=True,text=True,check=True).stdout)
a,b=probe(source),probe(out);assert abs(float(a['format']['duration'])-float(b['format']['duration']))<.1
assert[(s['codec_type'],s.get('width'),s.get('height'))for s in a['streams']]==[(s['codec_type'],s.get('width'),s.get('height'))for s in b['streams']]
subprocess.run(['ffmpeg','-nostdin','-v','error','-i',str(out),'-f','null','-'],check=True)
print(json.dumps({'originalBytes':source.stat().st_size,'webBytes':out.stat().st_size,'posterBytes':poster.stat().st_size,'duration':b['format']['duration']}))
