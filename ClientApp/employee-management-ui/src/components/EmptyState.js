function EmptyState({ message, colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-slate-500">
        {message}
      </td>
    </tr>
  );
}

export default EmptyState;