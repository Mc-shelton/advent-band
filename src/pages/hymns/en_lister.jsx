import { useGiraf } from "../../giraf";

const HymnLanguage = ({searchText,setSong, setLan}) => {{

    const { gHead, addGHead } = useGiraf();
    return(
        <div className="hymn_language">
            {language
                .filter((t) => {
                  if (searchText) {
                    let txt = searchText.toLowerCase();
                    return (
                      t.title.toLocaleLowerCase().includes(txt) ||
                      t.number.includes(txt)
                    );
                  } else {
                    return true;
                  }
                })
                .map((d, x) => {
                  return (
                    <div
                      className="row"
                      onClick={() => {
                        addGHead("lsearch", false);
                        setLan(d.code);
                      }}
                    >
                      <p className="c_1" style={{
                        fontWeight: "bold",
                        color: "#000",
                        borderBottom: "1px solid gray",
                        textAlign: "left",
                        margin:"0",
                        marginLeft:"14%",
                        marginRight:'14%',
                        padding:"2%",
                      }}>{d.code} - {d.name}</p>
                    </div>
                  );
                })}
        </div>
    )
}}

export default HymnLanguage