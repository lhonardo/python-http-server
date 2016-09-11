#!/usr/bin/python

import socket  # Suporte a rede
import signal  # Suporte a sinal (server encerra quando recebe sinal)
import time    # Pegar hora atual

class Server:

 def __init__(self, port = 2100):
     """ Construtor """
     self.host = '172.10.1.102'   # define o host do server
     self.port = port # define a porta que foi passada por parametro
     self.www_dir = 'www' # Diretorio onde estao os HTML

 def activate_server(self):
     self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
     try:
         print("Rodando Servidor HTTP  em ", self.host, ":",self.port)
         self.socket.bind((self.host, self.port))

     except Exception as e:
         print ("Aviso: Nao foi possivel conectar:",self.port,"\n")
         print ("Tentando em uma porta diferent")
         user_port = self.port
         self.port = 8080

         try:
             print("Rodando servidor HTTP em ", self.host, ":",self.port)
             self.socket.bind((self.host, self.port))

         except Exception as e:
             print("ERROR: Nao foi possivel rodar o servidor ", user_port, " e 8080. ")
             self.shutdown()
             import sys
             sys.exit(1)

     print ("Servidor rodando na porta:", self.port)
     print ("Pressione Ctrl+C para encerrar e sair.")
     self._wait_for_connections()

 def shutdown(self):
     """ Encerrar servidor """
     try:
         print("Encerrando servidor")
         s.socket.shutdown(socket.SHUT_RDWR)

     except Exception as e:
         print("Aviso: nao foi possivel encerrar, tome um cafe e tente novamente",e)

 def _gen_headers(self,  code):
     """ Gerar respostas do HTTP Headers """

     # determina codigos de resposta
     h = ''
     if (code == 200):
        h = 'HTTP/1.1 200 OK\n'
     elif(code == 404):
        h = 'HTTP/1.1 404 Not Found\n'

     # escrevendo outros metodos do header
     current_date = time.strftime("%a, %d %b %Y %H:%M:%S", time.localtime())
     h += 'Date: ' + current_date +'\n'
     h += 'Server: Simple-Python-HTTP-Server\n'
     h += 'Connection: close\n\n'  # sinal que a conexao vai ser fechada apos completar o request

     return h

 def _wait_for_connections(self):
     """ Loop principal de espera de conexoes """
     postContent = ''

     while True:
         print ("Esperando nova conexao")
         self.socket.listen(3) # numero maximo de conexoes em fila

         conn, addr = self.socket.accept()
         # conn - socket para o cliente
         # addr - endereco do cliente

         print("Nova conexao de:", addr)

         data = conn.recv(1024) #recebe dados do cliente
         string = bytes.decode(data) #converte isso para uma string

         #determina o tipo de request
         request_method = string.split(' ')[0]
         print ("Method: ", request_method)
         print ("Request body: ", string)

         #Se string[0:x] == 'POST':
         if (request_method == 'POST'):
             print ("Post recebido")
             #postContent += string.split('\n')[13].split('=')[1] + ' '
             postContent += string.split('\n')[12].split('=')[1] + ' '
             print postContent
             try:
                 f = open('www/words.html','w')
                 f.write(postContent + '\n') # escreve no iframe palavras vindas do POST
                 f.close()
             except Exception as e: #em caso do arquivo nao ser encontrado, gera pagina 404
                 print ("Erro, arquivo nao encontrado. Codigo de resposta 404\n", e)
             
             request_method = 'GET'

         #Se string[0:3] == 'GET':
         if (request_method == 'GET') | (request_method == 'HEAD'):
             #file_requested = string[4:]

             # split em espaco "GET /file.html" em -> ('GET','file.html',...)
             file_requested = string.split(' ')
             file_requested = file_requested[1] # get segundo elemento

             #Checar argumentos da URL
             file_requested = file_requested.split('?')[0]  # desconsiderar argumentos depois de '?'

             if (file_requested == '/'):  # se nao for especificado nenhum arquivo pelo browser
                 file_requested = '/index.html' # carrega index.html por padrao

             file_requested = self.www_dir + file_requested
             print ("Serving web page [",file_requested,"]")

             ## Carregar conteudo do arquivo
             try:
                 file_handler = open(file_requested,'rb')
                 if (request_method == 'GET'):  #apenas le arquivo quando for GET
                     response_content = file_handler.read() # le conteudo do arquivo
                 file_handler.close()

                 response_headers = self._gen_headers( 200)

             except Exception as e: #em caso do arquivo nao ser encontrado, gera pagina 404
                 print ("Erro, arquivo nao encontrado. Codigo de resposta 404\n", e)
                 response_headers = self._gen_headers( 404)

                 if (request_method == 'GET'):
                    response_content = b"<html><body><p>Error 404: File not found</p></body></html>"

             server_response =  response_headers.encode() # retorna headers de GET and HEAD
             if (request_method == 'GET'):
                 server_response +=  response_content  # returna conteudo adicional apenas para GET

             conn.send(server_response)
             print ("Closing connection with client")
             conn.close()

         else:
             print("HTTP request metodo desconhecido:", request_method)

def graceful_shutdown(sig, dummy):
    """ Desliga o server. Acionada por sinal SIGINT """
    s.shutdown() #desliga server
    import sys
    sys.exit(1)

###########################################################
# desliga com ctrl+c
signal.signal(signal.SIGINT, graceful_shutdown)

print ("Starting web server")
s = Server(2100)  # objeto construtor do server
s.activate_server() # ativa socket

