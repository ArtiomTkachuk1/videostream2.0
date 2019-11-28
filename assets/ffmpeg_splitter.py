import datetime
import nptime
import os

format="webm"#format of file to split
sourceName="source"#name of file to split
chunkNum=6#Number of chunks
chunkLength=5#duration of chunk

def getChunkName(chunkCurr,format):
    return("chunk"+str(chunkCurr)+"."+format)

def getInstruction(currTime,chunkTime,fileName,chunkCurr,format):
    instruction=['ffmpeg','-i',fileName,'-ss',str(currTime),'-t',str(chunkTime),'-c','copy',getChunkName(chunkCurr,format)]
    return(instruction)

def runInstructions(chunkNum,chunkLength,sourceName,format):
    currTime=nptime.nptime(0,0,0)
    chunkTime=datetime.timedelta(0, chunkLength)
    chunkCurr=0
    fileName=sourceName+"."+format
    instructions=[]
    for i in range(chunkNum):
        separator=' '
        instruction=getInstruction(currTime,chunkTime,fileName,chunkCurr,format)
        currTime=currTime+chunkTime
        chunkCurr+=1
        instruction=separator.join(instruction)+"\n"
        print(instruction)
        os.system(instruction)

runInstructions(chunkNum,chunkLength,sourceName,format)
