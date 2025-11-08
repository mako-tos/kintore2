import React from 'react';
import { useRouter } from 'next/router';
import TrainingMenuForm from '../../components/TrainingMenuForm';

const NewTrainingMenuPage: React.FC = () => {
  const router = useRouter();

  return (
    <div style={{ padding: '1rem' }}>
      <TrainingMenuForm
        onSuccess={() => {
          // redirect after short delay to allow user to see success message
          setTimeout(() => router.push('/'), 500);
        }}
        onCancel={() => router.push('/')}
      />
    </div>
  );
};

export default NewTrainingMenuPage;
