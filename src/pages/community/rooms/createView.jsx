import { useGiraf } from "../../../giraf";

const CreateRoomView = () => {
  const { gHead, addGHead } = useGiraf();
  return (
    <div className="cr_create_room">
      <p className="cr_hd">Create Room</p>
      <p className="cr_title">Room Title (Summery of the question).</p>
      <input
        className="cr_input"
        type="text"
        placeholder="What is the sanctuary?"
        onFocus={() => {
          addGHead("keyboard", true);
          console.log("onfocus");
        }}
        onBlur={() => {
          setTimeout(() => {
            addGHead("keyboard", undefined);
          }, 100);
          console.log("onblure");
        }}
      ></input>
      <p className="cr_title">
        Room Description (Full statement of the question).
      </p>
      <textarea
        className="cr_textarea"
        placeholder="full question goes here"
        onFocus={() => {
          addGHead("keyboard", true);
          console.log("onfocus");
        }}
        onBlur={() => {
          setTimeout(() => {
            addGHead("keyboard", undefined);
          }, 100);
          console.log("onblure");
        }}
        rows={7}
      ></textarea>
      <div className="cr_room_butt" onClick={()=>{
        addGHead("room_view", "room_main");
        addGHead("comm_page_prev", []);
      }}>Create Room</div>
    </div>
  );
};
export default CreateRoomView;
