import { useState } from 'react';
import { pastRaces, Race } from '@/lib/races-data';
import RaceCard from '@/components/RaceCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Trophy } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

const EventosPassados = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Lógica de Paginação
  const totalPages = Math.ceil(pastRaces.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRaces = pastRaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="pt-24 pb-16 min-h-screen bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Resultados e Histórico</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira as corridas que já foram realizadas pela Tribo. 
            Veja detalhes dos eventos anteriores.
          </p>
        </div>

        {pastRaces.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentRaces.map((race) => (
                <div key={race.id} className="opacity-90 hover:opacity-100 transition-opacity">
                   {/* DICA: Aqui usamos o mesmo Card. 
                      Idealmente, o RaceCard poderia ter uma prop "isPast" 
                      para mudar o botão de "Inscrever-se" para "Ver Detalhes" 
                   */}
                  <RaceCard race={race} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(p => p - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(p => p + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-border">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhum evento passado</h3>
            <p className="text-muted-foreground">
              Ainda não temos histórico de corridas realizadas em 2026.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default EventosPassados;