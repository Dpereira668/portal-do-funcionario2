
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, FileText, Download, Trash2 } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";

const DocumentosIndex = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pagination = usePagination({ pageSize: 9 });

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', pagination.currentPage],
    queryFn: async () => {
      const { start, end } = pagination.getRange();
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;
      
      if (data) {
        pagination.updateHasMore(data.length);
      }
      
      return data;
    }
  });

  const handleFileUpload = async (file: File, formData: FormData) => {
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const filePath = `${timestamp}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleAddDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const file = formData.get('file') as File;
      
      if (!file || file.size === 0) {
        throw new Error('Por favor, selecione um arquivo');
      }

      const fileUrl = await handleFileUpload(file, formData);
      
      const { error } = await supabase
        .from('documents')
        .insert({
          title: formData.get('title'),
          description: formData.get('description'),
          document_type: formData.get('document_type'),
          file_url: fileUrl,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Documento adicionado",
        description: "O documento foi adicionado com sucesso.",
      });

      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar documento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, fileUrl: string) => {
    try {
      const filePath = fileUrl.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('documents')
          .remove([filePath]);
      }

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso.",
      });

      queryClient.invalidateQueries({ queryKey: ['documents'] });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir documento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Gestão de Documentos</h2>
            <p className="text-muted-foreground">
              Gerenciamento centralizado de documentos da empresa
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Documento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDocument} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input name="title" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input name="description" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Documento</label>
                  <select
                    name="document_type"
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="contrato">Contrato</option>
                    <option value="regulamento">Regulamento</option>
                    <option value="manual">Manual</option>
                    <option value="politica">Política</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Arquivo</label>
                  <Input name="file" type="file" required />
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? "Enviando..." : "Adicionar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : documents?.map((document) => (
            <Card key={document.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {document.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {document.description || "Sem descrição"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tipo:</span>
                    <span className="text-sm font-medium capitalize">
                      {document.document_type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(document.file_url, '_blank')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteDocument(document.id, document.file_url)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={pagination.previousPage}
            disabled={pagination.currentPage === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={pagination.nextPage}
            disabled={!pagination.hasMore}
          >
            Próximo
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DocumentosIndex;
