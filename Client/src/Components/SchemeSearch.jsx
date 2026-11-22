import { useId } from "react"
import { useTranslation } from "react-i18next"
import { FiSearch } from "react-icons/fi"

export default function SchemeSearch({ value, onChange, onSearch }) {
  const { t } = useTranslation()
  const searchId = useId()

  function submit(event) {
    event.preventDefault()
    onSearch(new FormData(event.currentTarget).get("q").trim())
  }

  return (
    <form className="kc-search" role="search" onSubmit={submit}>
      <label htmlFor={searchId}>{t("hero.searchLabel")}</label>
      <div className="kc-search-field">
        <FiSearch aria-hidden="true" />
        <input
          type="search"
          name="q"
          id={searchId}
          placeholder={t("hero.searchPlaceholder")}
          value={value}
          onChange={onChange && ((event) => onChange(event.target.value))}
        />
        <button className="kc-button" type="submit">{t("hero.searchBtn")}</button>
      </div>
    </form>
  )
}
