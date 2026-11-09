#ifndef UNICODE
#define UNICODE
#endif
#define _UNICODE
#include <windows.h>
#include <stdio.h>
#include <wchar.h>
int wmain(int argc,wchar_t **argv) {
    wchar_t root[32768],command[32768],python[32768];
    if(!GetModuleFileNameW(NULL,root,32768)) return 1;
    wchar_t *slash=wcsrchr(root,L'\\'); if(!slash)return 1; *slash=0;
    if(!SetCurrentDirectoryW(root))return 1;
    swprintf(python,32768,L"%ls\\runtime\\python.exe",root);
    wchar_t portEnv[16]={0};GetEnvironmentVariableW(L"INTERALIVES_PORT",portEnv,16);
    long port=argc>1?wcstol(argv[1],NULL,10):wcstol(portEnv,NULL,10);if(port<1024||port>65535)port=8788;
    swprintf(command,32768,L"\"%ls\" \"%ls\\servidor.py\" --open --port %ld",python,root,port);
    SetConsoleOutputCP(CP_UTF8);SetConsoleTitleW(L"INTERALIVES QI ARENA STUDIO 4.1");
    if(GetFileAttributesW(python)==INVALID_FILE_ATTRIBUTES){
        puts("Extraia TODO o ZIP antes de iniciar. Pasta runtime ausente.");getchar();return 1;
    }
    STARTUPINFOW si={0};si.cb=sizeof(si);PROCESS_INFORMATION pi={0};
    if(!CreateProcessW(python,command,NULL,NULL,TRUE,0,NULL,root,&si,&pi)){
        printf("Falha ao iniciar Python local. Codigo Windows: %lu\n",GetLastError());getchar();return 1;
    }
    WaitForSingleObject(pi.hProcess,INFINITE);DWORD status=1;GetExitCodeProcess(pi.hProcess,&status);CloseHandle(pi.hProcess);CloseHandle(pi.hThread);
    if(status){puts("Falha ao iniciar. Confira o erro acima. Pressione Enter para fechar.");getchar();}
    return (int)status;
}
