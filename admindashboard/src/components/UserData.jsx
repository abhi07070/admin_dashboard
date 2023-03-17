const UserData = ({ data, onDelete, onUpdate }) => {

  let counter = 1;
  return (
    <>
      {data.map((data) => {
        const { _id, name, age, email, gender } = data;
        const firstName = name.charAt(0).toUpperCase() + name.slice(1).split(" ")[0]
        const lastName = name.split(" ")[1];
        return (
          <tr key={data.id} >
            <td>{counter++}</td>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{age}</td>
            <td>{email}</td>
            <td>{gender.charAt(0).toUpperCase() + gender.slice(1)}</td>
            <td>
              <div className="btns">
                <button className="del-btn" onClick={() => onDelete(_id)}>Delete</button>
                <button className="del-btn" onClick={() => onUpdate(_id, name, age, email, gender)}>update</button>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default UserData;