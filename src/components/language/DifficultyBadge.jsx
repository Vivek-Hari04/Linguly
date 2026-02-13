export default function DifficultyBadge({ difficulty }) {
  const styles = {
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[difficulty] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {difficulty}
    </span>
  );
}