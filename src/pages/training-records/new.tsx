import React, { useState } from 'react';
import TrainingRecordForm from '../../components/TrainingRecordForm';
import TrainingRecordLog from '../../components/TrainingRecordLog';

const NewTrainingRecordPage: React.FC = () => {
  const [localEntry, setLocalEntry] = useState<{ menuId: string; menuName: string; count: number } | null>(null);

  // YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ padding: '1rem' }}>
      <TrainingRecordForm onAutoSaved={(entry) => setLocalEntry(entry)} />
      <TrainingRecordLog date={today} localNewEntry={localEntry} />
    </div>
  );
};

export default NewTrainingRecordPage;