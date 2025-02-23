export const DescriptionWithHashtags = ({ text }: { text: string }) => {
  const parts = text.split(/(#\S+)/g);

  return (
    <p className="leading-relaxed">
      {parts.map((part, index) =>
        part.startsWith("#") ? (
          <span key={index} style={{ color: "#3b82f6", fontWeight: "bold" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
};
export const filterContacts = (
  contacts: any[],
  searchQuery: string,
  selectedDivision: string,
  selectedDistrict: string
) => {
  return contacts.filter((contact) => {
    const matchesSearch = searchQuery
      ? contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      : true;

    const matchesDivision =
      !selectedDivision || selectedDivision === "all"
        ? true
        : contact.division.toLowerCase() === selectedDivision.toLowerCase();

    const matchesDistrict =
      !selectedDistrict || selectedDistrict === "all"
        ? true
        : contact.district.toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesDivision && matchesDistrict;
  });
};
