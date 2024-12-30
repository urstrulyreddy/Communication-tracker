import { useState } from 'react';
import { CommunicationMethod } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { CommunicationMethodForm } from './CommunicationMethodForm';
import { useCommunicationMethodsStore } from '../../store/communicationMethodsStore';
import { useStore } from '../../store/useStore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface CommunicationMethodListProps {
  companyId: string;
}

export function CommunicationMethodList({ companyId }: CommunicationMethodListProps) {
  const { methods, addMethod, updateMethod } = useCommunicationMethodsStore();
  const { companies, updateCompany } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingMethod, setEditingMethod] = useState<CommunicationMethod | null>(null);

  const company = companies.find(c => c.id === companyId);
  const companyMethods = company?.preferredMethods || [];

  const handleSubmit = (data: CommunicationMethod) => {
    if (editingMethod) {
      updateMethod(data);
      setEditingMethod(null);
    } else {
      addMethod(data);
    }
    setIsAdding(false);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !company) return;

    const items = Array.from(companyMethods);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCompany({
      ...company,
      preferredMethods: items
    });
  };

  const toggleMethodMandatory = (methodName: string) => {
    if (!company) return;
    
    const mandatoryMethods = company.mandatoryMethods || [];
    const newMandatoryMethods = mandatoryMethods.includes(methodName)
      ? mandatoryMethods.filter(m => m !== methodName)
      : [...mandatoryMethods, methodName];
      
    updateCompany({
      ...company,
      mandatoryMethods: newMandatoryMethods
    });
  };

  const getDefaultMethods = () => {
    return methods.sort((a, b) => a.sequence - b.sequence);
  };

  const initializeCompanyMethods = () => {
    if (!company?.preferredMethods || company.preferredMethods.length === 0) {
      const defaultSequence = getDefaultMethods().map(m => m.name);
      updateCompany({
        ...company!,
        preferredMethods: defaultSequence
      });
    }
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="methods">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {companyMethods.map((methodName, index) => {
                const method = methods.find(m => m.name === methodName);
                if (!method) return null;

                return (
                  <Draggable key={method.id} draggableId={method.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-4 p-3 bg-white rounded-lg border mb-2"
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              company?.mandatoryMethods?.includes(method.name) 
                                ? 'success' 
                                : 'secondary'
                            }
                          >
                            {company?.mandatoryMethods?.includes(method.name) 
                              ? 'Mandatory' 
                              : 'Optional'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMethodMandatory(method.name)}
                          >
                            Toggle Mandatory
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Method Button and Form */}
      {isAdding ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <CommunicationMethodForm
            initialData={editingMethod || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsAdding(false);
              setEditingMethod(null);
            }}
          />
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </Button>
        </div>
      )}
    </div>
  );
}